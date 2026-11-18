import json
import re
import subprocess
from pathlib import Path
from uuid import uuid4
from http.cookiejar import CookieJar
from urllib.request import build_opener, HTTPCookieProcessor, Request
from urllib.error import HTTPError

base = "http://127.0.0.1:8001"
compose = ["C:/Program Files/Docker/Docker/resources/cli-plugins/docker-compose.exe",
           "-f", "C:/dev/projects/ativos/clinica-odonto-personnallite/backend/compose.yaml"]
request_id = str(uuid4())
name = "TESTE TECNICO INTEGRACAO"
opener = build_opener(HTTPCookieProcessor(CookieJar()))
query = f"Lead.objects.filter(request_id='{request_id}', name='{name}')"

def shell(code):
    result = subprocess.run(compose + ["exec", "-T", "api", "python", "manage.py", "shell", "-c", code],
                            capture_output=True, text=True, check=True, timeout=40)
    return json.loads(result.stdout.strip().splitlines()[-1])

summary = {}
try:
    with opener.open(base+"/contato", timeout=20) as response:
        page = response.read().decode()
        assert response.status == 200
        summary["contact_page"] = response.status
    asset = re.search(r'src="(/assets/[^"]+\.js)"', page).group(1)
    with opener.open(base+asset, timeout=20) as response:
        assert response.status == 200
        summary["javascript"] = response.status
    with opener.open(base+"/api/v1/contact/config/", timeout=20) as response:
        token = json.load(response)["csrfToken"]
    payload = {"name": name, "phone": "91999990000", "source": "site", "campaign": "teste_local",
               "acknowledged": True, "website": "", "request_id": request_id}
    for expected in (201, 200):
        request = Request(base+"/api/v1/contact/requests/", data=json.dumps(payload).encode(), method="POST",
                          headers={"Content-Type":"application/json", "X-CSRFToken":token})
        with opener.open(request, timeout=20) as response:
            assert response.status == expected
            assert json.load(response) == {"status":"received"}
            summary["first_post" if expected == 201 else "retry_post"] = expected
    result = shell("import json; from apps.leads.models import Lead; print(json.dumps({'count': "+query+".count(), 'new': "+query+".filter(status='new').exists()}))")
    assert result == {"count":1,"new":True}
    summary["postgresql_record"] = "one new contact"
    try:
        opener.open(base+"/api/v1/leads/", timeout=20)
        raise AssertionError("Public list must be blocked")
    except HTTPError as error:
        assert error.code == 403
        summary["private_list"] = error.code
finally:
    cleanup = shell("import json; from apps.leads.models import Lead; print(json.dumps({'removed': "+query+".delete()[0]}))")
    summary["temporary_test_records_removed"] = cleanup["removed"]
Path("docs/integracao-local-validacao.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(summary))
