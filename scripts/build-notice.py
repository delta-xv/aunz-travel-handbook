from collections import Counter
from html import escape
from pathlib import Path
import re
import hashlib
import pdfplumber
from pdfplumber.utils import extract_text

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / 'assets/documents/departure-notice.pdf'
TABLES = {1:[1,2],2:[0],3:[],4:[1],5:[],6:[1],7:[0,1],8:[0],9:[0],10:[0],11:[0],12:[0],13:[0],14:[0],15:[1,2],16:[0]}
BULLETS = str.maketrans({'\uf06c':'•','\uf06e':'•','\uf0b2':'•'})

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

def flow(text):
    blocks=[]
    for line in text.splitlines():
        line=line.strip()
        if not line:
            continue
        heading=bool(re.match(r'^(?:[一二三四五六七八九十]+、|◆|行程报价|【[^】]*自费)',line))
        new=heading or bool(re.match(r'^(?:[•※]|\d{1,2}[、．]|(?:早餐|午餐|晚餐|Address|Phone)[:：])',line))
        if not blocks or new or blocks[-1][0]:
            blocks.append([heading,line])
        else:
            separator=' ' if re.search(r'[A-Za-z0-9)]$',blocks[-1][1]) and re.match(r'[A-Za-z0-9(]',line) else ''
            blocks[-1][1]+=separator+line
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
    previous_bottom=None
    def flush():
        if lines:
            text='\n'.join(lines)
            parts.append(flow(text));audit.append(text);lines.clear()
    for _,kind,obj in sorted(events,key=lambda e:e[0]):
        if kind=='line':
            if previous_bottom is not None and obj['top']-previous_bottom>7:
                flush()
            lines.append(clean(obj['text']));previous_bottom=obj['bottom']
        else:
            flush();previous_bottom=None
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
    return f'<article class="notice-page" data-page="{number}" aria-label="原稿第{number}页"'+(' hidden' if number>1 else '')+'>'+''.join(parts)+'</article>',sum(original.values())

with pdfplumber.open(PDF) as document:
    if len(document.pages)!=16:
        raise ValueError('Review table selection for the new PDF page count')
    pages=[]
    count=0
    for number,page in enumerate(document.pages,1):
        html,length=render_page(page,number)
        pages.append(html);count+=length
        print(f'Page {number}: {length} characters checked')
header='''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#163746"><title>出团通知 · 澳新旅行日志</title><link rel="icon" href="data:,"><link rel="stylesheet" href="assets/documents.css"><link rel="stylesheet" href="assets/logbook.css"><script src="assets/documents.js" defer></script></head>
<body class="logbook logbook-documents"><main id="reader" class="reader" aria-label="出团通知"><header class="reader-header"><div class="reader-topbar"><a class="button" href="index.html#today">← 返回</a><h1 class="notice-title">出团通知</h1><a class="button" href="assets/documents/departure-notice.pdf" download="出团通知.pdf">原 PDF</a></div></header><div id="noticeContent" class="notice-content">'''
footer='''</div><footer class="reader-footer"><button id="previousPage" class="button" aria-label="上一页">← 上页</button><span id="pageCounter" class="notice-page-counter" role="status">1 / 16</span><button id="nextPage" class="button" aria-label="下一页">下页 →</button></footer><noscript><style>.notice-page[hidden]{display:block!important}.reader-footer{display:none}</style></noscript></main></body></html>'''
for asset in ['documents.css', 'documents.js', 'logbook.css']:
    version=hashlib.sha256((ROOT/'assets'/asset).read_bytes()).hexdigest()[:12]
    header=header.replace(f'assets/{asset}', f'assets/{asset}?v={version}')
(ROOT/'documents.html').write_text(header+'\n'.join(pages)+footer,encoding='utf-8')
print(f'All {len(pages)} pages: {count} source characters preserved; 1 figure transcribed to text')
