import sys
import requests
from bs4 import BeautifulSoup

domain = sys.argv[1]
crt_url = "https://crt.sh/?q=%s" % domain
r = requests.get(crt_url)
soup = BeautifulSoup(r.content, 'html5lib')
subdomain_set = {}
subdomain_set = set()

for tr in soup.find_all('tr')[1:]:
    tds = tr.find_all('td')
    if len(tds) == 7:
        data = (tds[5].find(text=True))
        if (data.endswith(domain) and not data.startswith("*")):
            subdomain_set.add(data)
        data = (tds[4].find(text=True))
        if (data.endswith(domain) and not data.startswith("*")):
            subdomain_set.add(data)

#print("hello")
print(subdomain_set)
# sys.stdout.flush()
