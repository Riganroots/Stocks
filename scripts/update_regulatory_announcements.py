#!/usr/bin/env python3
import json, re, hashlib
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.parse import urljoin
from urllib.request import Request, urlopen
from pathlib import Path

SOURCES=[
    ("SEBON News","https://sebon.gov.np/news","market"),
    ("SEBON Activities/Action","https://sebon.gov.np/activities-action?page=1","market"),
]
DATE_RE=re.compile(r"^\d{4}-\d{2}-\d{2}$")

class Rows(HTMLParser):
    def __init__(self):
        super().__init__(); self.in_tr=False; self.cells=[]; self.cell=[]; self.href=None; self.rows=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=="tr": self.in_tr=True; self.cells=[]; self.cell=[]; self.href=None
        elif self.in_tr and tag in ("td","th"): self.cell=[]
        elif self.in_tr and tag=="a" and attrs.get("href"): self.href=attrs["href"]
    def handle_data(self,data):
        if self.in_tr: self.cell.append(data)
    def handle_endtag(self,tag):
        if not self.in_tr:return
        if tag in ("td","th"):
            text=" ".join(" ".join(self.cell).split())
            if text:self.cells.append(text)
            self.cell=[]
        elif tag=="tr":
            if self.cells:self.rows.append((self.cells,self.href))
            self.in_tr=False

def fetch(url):
    req=Request(url,headers={"User-Agent":"NEPSE-Copilot/1.0 (+private research tool)"})
    with urlopen(req,timeout=30) as r:
        return r.read().decode("utf-8","replace")

def parse_source(name,url,scope):
    p=Rows(); p.feed(fetch(url)); out=[]
    for cells,href in p.rows:
        date=next((c for c in cells if DATE_RE.match(c)),None)
        if not date: continue
        title=next((c for c in cells if c!=date and len(c)>12 and not c.lower().startswith("title")),None)
        if not title: continue
        out.append({
            "id":re.sub(r"[^a-z0-9]+","-",name.lower()).strip("-")+"-"+date+"-"+hashlib.sha256(title.encode("utf-8")).hexdigest()[:10],
            "scope":scope,"symbols":[],"category":"regulatory","title":title,
            "publishedAt":date,"source":"Securities Board of Nepal (SEBON)",
            "sourceUrl":urljoin(url,href) if href else url,"summary":"",
            "impact":"context"
        })
    return out

def main():
    fetched=datetime.now(timezone.utc).isoformat()
    items=[]
    errors=[]
    for name,url,scope in SOURCES:
        try: items.extend(parse_source(name,url,scope))
        except Exception as e: errors.append(f"{name}: {e}")
    dedup={}
    for item in items:
        key=(item["title"],item["publishedAt"])
        item["fetchedAt"]=fetched
        dedup[key]=item
    items=sorted(dedup.values(),key=lambda x:x["publishedAt"],reverse=True)[:20]
    if not items:
        old=Path("data/announcements.json")
        if old.exists():
            payload=json.loads(old.read_text())
            payload["refreshAttemptedAt"]=fetched
            payload["refreshErrors"]=errors or ["No rows parsed"]
        else:
            raise SystemExit("No SEBON announcements parsed and no fallback exists")
    else:
        payload={
            "generatedAt":fetched,
            "sources":[{"name":"Securities Board of Nepal (SEBON)","type":"regulator","url":"https://sebon.gov.np/news"}],
            "items":items,
            "refreshErrors":errors
        }
    Path("data/announcements.json").write_text(json.dumps(payload,indent=2,ensure_ascii=False))
    print(f"Announcements: {len(payload.get('items',[]))}; errors: {len(errors)}")

if __name__=="__main__":
    main()
