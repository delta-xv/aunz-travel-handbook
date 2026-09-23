from collections import Counter
from html import escape
from pathlib import Path
import re
import hashlib
import argparse
import json
import pdfplumber
from pdfplumber.utils import extract_text
from lxml import html as dom

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description='从仓库外的原始 PDF 生成公开出团通知')
parser.add_argument('source', type=Path, help='原始出团通知 PDF 路径')
PDF = parser.parse_args().source.resolve()
if PDF.is_relative_to(ROOT):
    parser.error('原始 PDF 必须保存在仓库外')
TABLES = {1:[1,2],2:[0],3:[],4:[1],5:[],6:[1],7:[0,1],8:[0],9:[0],10:[0],11:[0],12:[0],13:[0],14:[0],15:[1,2],16:[0]}
BULLETS = str.maketrans({'\uf06c':'•','\uf06e':'•','\uf0b2':'•'})
SUBHEADINGS = ['集合与出发', '航班与行李携带', '海关与出入境', '自备物品、气候', '住宿、饮食', '时差、交通、卫生', '货币', '安全', '退税及兑换货币', '其他注意事项', '旅游保险']
OMITTED_PARAGRAPH = '本团市场价格是49800元/人，如领队发现团里客人有低于市场价格的情况，领队有权在团上收取差价!'
PUBLIC_CONTACTS = json.loads((ROOT / 'scripts/public-contacts.json').read_text(encoding='utf-8'))
PASSENGER_LABEL = re.compile(r'(?:顾客|旅客|游客|客人|乘客)姓名\s*[:：].*')
PASSENGER_NAME = re.compile(r'\b[A-Z]{2,}\s*/\s*[A-Z]{2,}\b')
PHONE = re.compile(r'(?:\+\s*\d{1,3}|00\s*\d{1,3})[\d ()-]{5,}\d|\b1800[-\s]\d{3}[-\s]\d{3}\b')
PHONE_LABEL = re.compile(r'(?:Phone|Tel(?:ephone)?|电话)[^:：\n]{0,8}[:：]\s*(\d{5}(?!\d)|[+\d][\d ()-]{3,}\d)',re.I)

def clean(text):
    return text.translate(BULLETS)

def chars_text(chars):
    return clean(extract_text(chars, x_tolerance=1, y_tolerance=3) or '')

def inside(char, box):
    x=(char['x0']+char['x1'])/2
    y=(char['top']+char['bottom'])/2
    return box[0] <= x < box[2] and box[1] <= y < box[3]

def normalized(text):
    return ''.join(clean(text).split())

def join_text(left, right):
    separator=' ' if re.search(r'[A-Za-z0-9)]$',left) and re.match(r'[A-Za-z0-9(]',right) else ''
    return left+separator+right

def starts_paragraph(line):
    return bool(re.match(r'^(?:[•※]|\d{1,2}[、．]|(?:早餐|午餐|晚餐|Address|Phone)[:：]|本团市场价格是)',line))

def flow(text):
    blocks=[]
    for line in text.splitlines():
        line=line.strip()
        if not line:
            continue
        title=normalized(line).lstrip('•')
        heading=bool(re.match(r'^(?:[一二三四五六七八九十]+、|◆|行程报价|【[^】]*自费)',line)) or title in SUBHEADINGS or title in ['注意事项','—出团通知—'] or title.startswith('澳大利亚（凯恩斯）新西兰南北岛（库克山）')
        new=heading or starts_paragraph(line)
        if not blocks or new or blocks[-1][0]:
            blocks.append([heading,line])
        else:
            blocks[-1][1]=join_text(blocks[-1][1],line)
    return ''.join(f'<{"h3" if heading else "p"}>{escape(value)}</{"h3" if heading else "p"}>' for heading,value in blocks)

def edges(values):
    result=[]
    for v in sorted(values):
        if not result or abs(v-result[-1])>0.5:
            result.append(v)
    return result

def render_table(page, table, number, audit):
    cells=[]
    allocated=set()
    for box in sorted(table.cells,key=lambda c:((c[2]-c[0])*(c[3]-c[1]),c[1],c[0])):
        chars=[c for c in page.chars if id(c) not in allocated and inside(c,box)]
        text=chars_text(chars)
        allocated.update(id(c) for c in chars)
        if not text.strip() and box[2]-box[0]<10:
            continue
        cells.append({'box':box,'text':text})
        audit.append(text)
    remaining=[c for c in page.chars if inside(c,table.bbox) and id(c) not in allocated]
    if normalized(''.join(c['text'] for c in remaining)):
        raise ValueError(f'Page {number}: table contains unassigned text')
    xs=edges([x for c in cells for x in [c['box'][0],c['box'][2]]])
    ys=edges([y for c in cells for y in [c['box'][1],c['box'][3]]])
    grid={}
    for cell in cells:
        x0,y0,x1,y1=cell['box']
        col=min(range(len(xs)),key=lambda i:abs(xs[i]-x0))
        row=min(range(len(ys)),key=lambda i:abs(ys[i]-y0))
        cell['colspan']=min(range(len(xs)),key=lambda i:abs(xs[i]-x1))-col
        cell['rowspan']=min(range(len(ys)),key=lambda i:abs(ys[i]-y1))-row
        grid[row,col]=cell
    column_count=len(xs)-1
    trip_table=7<=number<=14 and table.bbox[0]<25
    if trip_table:
        rows=[]
        for row in range(len(ys)-1):
            entries=[grid[row,col] for col in range(column_count) if (row,col) in grid]
            if not entries:
                continue
            if len(entries)==1:
                rows.append('<div class="notice-prose">'+flow(entries[0]['text'])+'</div>')
            elif re.match(r'^D\d+\b',entries[0]['text']):
                rows.append('<div class="notice-day">'+''.join('<div>'+flow(c['text'])+'</div>' for c in entries)+'</div>')
            else:
                rows.append('<div class="notice-facts">'+''.join('<div>'+flow(c['text'])+'</div>' for c in entries)+'</div>')
        return ''.join(rows)
    wide=number in [2,4,15]
    rows=[]
    if number==2:
        header=['日期','航班号','起飞地点','降落地点','预计起飞时间','预计降落时间']
        first=[grid[0,col] for col in range(column_count) if (0,col) in grid]
        if len(first)!=6:
            raise ValueError('Flight table must have six columns')
        rows.append('<thead><tr>'+''.join(f'<th colspan="{cell["colspan"]}" scope="col">{label}</th>' for cell,label in zip(first,header))+'</tr></thead>')
    for row in range(len(ys)-1):
        values=[]
        for col in range(column_count):
            if (row,col) not in grid:
                continue
            cell=grid[row,col]
            values.append(f'<td colspan="{cell["colspan"]}" rowspan="{cell["rowspan"]}">{flow(cell["text"])}</td>')
        if values:
            rows.append('<tr>'+''.join(values)+'</tr>')
    return f'<div class="notice-table-wrap" tabindex="0" aria-label="原稿第{number}页表格"><table class="notice-table{" wide" if wide else ""}">'+''.join(rows)+'</table></div>'

def render_page(page, number):
    available=page.find_tables()
    selected=[available[i] for i in TABLES[number]]
    excluded=[t.bbox for t in selected]
    outside=page.filter(lambda obj: obj.get('object_type')!='char' or not any(inside(obj,b) for b in excluded))
    events=[]
    for line in outside.extract_text_lines(x_tolerance=1,y_tolerance=3,return_chars=True):
        events.append((line['top'],'line',line))
    for table in selected:
        events.append((table.bbox[1],'table',table))
    if page.images:
        if number!=4 or len(page.images)!=1:
            raise ValueError('Review unexpected PDF figures before conversion')
        events.append((page.images[0]['top'],'image',None))
    parts=[]
    audit=[]
    lines=[]
    def flush():
        if lines:
            text='\n'.join(lines)
            parts.append(flow(text));audit.append(text);lines.clear()
    for _,kind,obj in sorted(events,key=lambda e:e[0]):
        if kind=='line':
            if obj['text'].strip()==str(number) and obj['top']>page.height-40:
                flush()
                parts.append(f'<p class="source-page-number">{number}</p>')
                audit.append(obj['text'])
                continue
            lines.append(clean(obj['text']))
        else:
            flush()
            if kind=='table':
                parts.append(render_table(page,obj,number,audit))
            else:
                rows=[
                    ('禁止入境','肉类、家禽、猪肉、蛋类；活植物、种子；乳酪、乳制品；新鲜水果、蔬菜。'),
                    ('需要检疫','干菇、人参；茶叶；烘焙坚果；海鲜；带泥土的运动器材；木制品。'),
                    ('允许入境','面条、面包、饼干、软饮料、各式糖果甜食、巧克力。'),
                ]
                parts.append('<h3>原稿图示：入境物品</h3><div class="notice-table-wrap"><table class="notice-table notice-items"><tbody>'+''.join('<tr><th scope="row">'+escape(label)+'</th><td>'+escape(items)+'</td></tr>' for label,items in rows)+'</tbody></table></div>')
    flush()
    original=Counter(normalized(''.join(c['text'] for c in page.chars)))
    rendered=Counter(normalized(''.join(audit)))
    if original!=rendered:
        raise ValueError(f'Page {number}: missing {original-rendered}, extra {rendered-original}')
    return '<div>'+''.join(parts)+'</div>',sum(original.values())

def merge_paragraphs(left, right):
    last=left[-1] if len(left) else None
    first=right[0] if len(right) else None
    if last is not None and first is not None and last.tag==first.tag=='p':
        a=last.text_content();b=first.text_content()
        if a and b and not starts_paragraph(b) and not re.search(r'[。！？!?；;：:]$',a):
            last.text=join_text(a,b)
            right.remove(first)
    for child in list(right):
        left.append(child)


def remove_content(element, expected):
    expected.subtract(Counter(normalized(element.text_content())))
    element.getparent().remove(element)


def replace_content(element, text, expected):
    expected.subtract(Counter(normalized(element.text_content())))
    for child in list(element):
        element.remove(child)
    element.text=text
    expected.update(Counter(normalized(text)))


def sanitize_contacts(roots, expected):
    private_rows=0
    for root in roots:
        for row in root.xpath('.//tr'):
            label=normalized(row[0].text_content()) if len(row) else ''
            if label in {'全程领队','接机牌'}:
                remove_content(row,expected)
                private_rows+=1
            elif label.endswith('地接社'):
                if len(row)!=4 or normalized(row[2].text_content())!='电话':
                    raise ValueError('Review agency contact columns before publishing')
                for cell in list(row)[2:]:
                    remove_content(cell,expected)
                row[1].set('colspan','3')
            elif label=='旅游保险' and any('客服电话' in cell.text_content() for cell in row):
                insurance=PUBLIC_CONTACTS['insurance']
                if insurance['match'] not in row[1].text_content():
                    raise ValueError('Review insurer before publishing contact numbers')
                phone_text='客服电话：'+insurance['customer']+' 24 小时援助电话：'+' / '.join(insurance['assistance'])
                replace_content(row[-1],phone_text,expected)
        for paragraph in root.xpath('.//p'):
            text=paragraph.text_content()
            if PASSENGER_LABEL.search(text):
                replace_content(paragraph,PASSENGER_LABEL.sub('',text).strip(),expected)
    if private_rows!=2:
        raise ValueError('Review personal-information rows before publishing')


def sanitize_hotels(blocks, expected):
    for block in blocks:
        if block.get('class')!='notice-facts':
            continue
        for index,label in enumerate(block):
            if normalized(label.text_content())!='住宿' or index+1>=len(block):
                continue
            lodging=block[index+1]
            text=normalized(lodging.text_content()).casefold()
            contact=next((item for item in PUBLIC_CONTACTS['hotels'] if normalized(item['match']).casefold() in text),None)
            for paragraph in list(lodging):
                value=paragraph.text_content()
                if re.match(r'^(?:Phone|Tel|Telephone|电话|联系电话)\s*[:：]',value,re.I):
                    remove_content(paragraph,expected)
                elif PHONE.search(value):
                    replace_content(paragraph,PHONE.sub('',value).strip(),expected)
            if contact:
                phone=dom.Element('p')
                phone.text='电话：'+contact['phone']
                lodging.append(phone)
                expected.update(Counter(normalized(phone.text)))


def validate_public_content(blocks):
    allowed={re.sub(r'\D','',item['phone']) for item in PUBLIC_CONTACTS['hotels']}
    allowed.update(re.sub(r'\D','',phone) for phone in PUBLIC_CONTACTS['insurance']['assistance'])
    allowed.add(PUBLIC_CONTACTS['insurance']['customer'])
    for block in blocks:
        text=block.text_content()
        if PASSENGER_LABEL.search(text) or PASSENGER_NAME.search(text) or re.search(r'(?<!\d)1[3-9]\d{9}(?!\d)',text):
            raise ValueError('Personal information remains in notice content')
        for fragment in block.itertext():
            for phone in PHONE.findall(fragment)+PHONE_LABEL.findall(fragment):
                if re.sub(r'\D','',phone) not in allowed:
                    raise ValueError('Unapproved telephone number in notice content')


def organize(pages):
    roots=[dom.fromstring(page) for page in pages]
    expected=Counter(normalized(''.join(root.text_content() for root in roots)))
    sanitize_contacts(roots,expected)
    blocks=[]
    removed=0
    for root in roots:
        for el in list(root):
            text=el.text_content()
            if el.get('class')=='source-page-number':
                expected.subtract(Counter(normalized(text)))
                continue
            if normalized(text)==OMITTED_PARAGRAPH:
                expected.subtract(Counter(normalized(text)));removed+=1
                continue
            if not text.strip():
                continue
            previous=blocks[-1] if blocks else None
            if previous is not None and previous.get('class')==el.get('class')=='notice-prose':
                merge_paragraphs(previous,el)
                continue
            if previous is not None and previous.get('class')==el.get('class')=='notice-facts' and len(el)==4 and not el[0].text_content().strip() and not el[2].text_content().strip():
                if len(previous)!=4:
                    raise ValueError('Unexpected continued itinerary facts')
                for col in [1,3]:
                    merge_paragraphs(previous[col],el[col])
                continue
            blocks.append(el)
    if removed!=1:
        raise ValueError('Expected exactly one excluded paragraph')
    sanitize_hotels(blocks,expected)
    validate_public_content(blocks)
    sections=[]
    pending=[]
    fixed={
        '一、团队信息':('team','团队信息','团队信息'),
        '二、航班信息':('flights','航班信息','航班信息'),
        '三、旅行团须知':('notice','旅行团须知','须知概览'),
        '旅游保险':('insurance','旅游保险','旅游保险'),
        '注意事项':('itinerary-notes','每日行程','行程注意事项'),
        '行程报价包含':('included','费用说明','行程报价包含'),
        '行程报价不含':('excluded','费用说明','行程报价不含'),
    }
    extras=0
    for el in blocks:
        text=normalized(el.text_content()).lstrip('•')
        spec=None
        if el.tag=='h3':
            if text in fixed:
                spec=fixed[text]
            elif text in SUBHEADINGS:
                spec=('notice-'+str(SUBHEADINGS.index(text)+1),'旅行团须知',text)
            elif text=='【参考自费项目及时间】':
                extras+=1
                spec=('extras-'+str(extras),'参考自费项目','澳大利亚' if extras==1 else '新西兰')
        elif el.get('class')=='notice-day':
            match=re.match(r'D(\d+)\s*(\d{2}/\d{2})',el[0].text_content())
            if not match:
                raise ValueError('Unrecognized itinerary heading')
            spec=('day-'+match[1],'每日行程','D'+match[1]+' · '+match[2])
        if spec:
            ident,group,title=spec
            el.set('id',ident+'-heading')
            el.set('tabindex','-1')
            if el.tag=='h3':
                el.tag='h2'
            else:
                el.set('role','heading');el.set('aria-level','2')
            sections.append({'id':ident,'group':group,'title':title,'blocks':pending+[el]})
            pending=[]
        elif sections:
            sections[-1]['blocks'].append(el)
        else:
            pending.append(el)
    if pending or extras!=2 or len([s for s in sections if s['id'].startswith('day-')])!=15:
        raise ValueError('Incomplete notice outline')
    actual=Counter(normalized(''.join(el.text_content() for s in sections for el in s['blocks'])))
    if +expected!=actual:
        raise ValueError(f'Notice content mismatch: missing {expected-actual}, extra {actual-expected}')
    groups={}
    for section in sections:
        groups.setdefault(section['group'],[]).append(section)
    links=[]
    for group,items in groups.items():
        if len(items)==1:
            links.append(f'<a class="outline-link" href="#{items[0]["id"]}">{escape(group)}<span aria-hidden="true">→</span></a>')
        else:
            links.append('<details class="outline-group"><summary>'+escape(group)+'</summary><div class="outline-children">'+''.join(f'<a class="outline-link" href="#{s["id"]}">{escape(s["title"])}<span aria-hidden="true">→</span></a>' for s in items)+'</div></details>')
    outline='<nav id="contents" class="notice-outline" aria-label="出团通知目录"><h2>目录</h2>'+''.join(links)+'</nav>'
    articles='\n'.join(f'<article id="{s["id"]}" class="notice-section" data-title="{escape(s["title"],quote=True)}" aria-labelledby="{s["id"]}-heading" hidden>'+''.join(dom.tostring(el,encoding='unicode',method='html') for el in s['blocks'])+'</article>' for s in sections)
    print(f'{len(sections)} sections: retained content verified; personal-information rows, excluded paragraph and source page numbers omitted')
    return outline+articles


with pdfplumber.open(PDF) as document:
    if len(document.pages)!=16:
        raise ValueError('Review table selection for the new PDF page count')
    pages=[]
    count=0
    for number,page in enumerate(document.pages,1):
        markup,length=render_page(page,number)
        pages.append(markup);count+=length
        print(f'Page {number}: {length} characters checked')
content=organize(pages)
header='''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#163746"><title>出团通知 · 澳新旅行手册</title><link rel="icon" href="data:,"><link rel="stylesheet" href="assets/documents.css"><link rel="stylesheet" href="assets/logbook.css"><script src="assets/documents.js" defer></script><script src="assets/background.js" defer></script></head>
<body class="logbook logbook-documents"><main id="reader" class="reader" aria-label="出团通知"><header class="reader-header"><div class="reader-topbar"><a id="noticeBack" class="button" href="index.html#today">← 手册</a><h1 class="notice-title">出团通知</h1></div></header><div id="noticeContent" class="notice-content">'''
footer='''</div><footer id="sectionNavigation" class="reader-footer" hidden><button id="previousSection" class="button">← 上一节</button><span id="sectionCounter" class="notice-page-counter" role="status"></span><button id="nextSection" class="button">下一节 →</button></footer><noscript><style>.notice-section[hidden]{display:block!important}.reader-footer{display:none!important}</style></noscript></main></body></html>'''
for asset in ['documents.css', 'documents.js', 'logbook.css', 'background.js']:
    version=hashlib.sha256((ROOT/'assets'/asset).read_bytes()).hexdigest()[:12]
    header=header.replace(f'assets/{asset}', f'assets/{asset}?v={version}')
(ROOT/'documents.html').write_text(header+content+footer,encoding='utf-8')
print(f'All {len(pages)} source pages: {count} characters audited; 1 figure transcribed to text')
