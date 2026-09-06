import re

files = {
    "frontend/src/app/(dashboard)/grow/page.tsx": "fetch(\"http://localhost:8001/api/grow/recommend\")",
    "frontend/src/app/(dashboard)/track/page.tsx": "fetch(\"http://localhost:8001/api/track/trends\")",
    "frontend/src/app/(dashboard)/reports/page.tsx": "fetch(\"http://localhost:8001/api/reports\")"
}

for file, fetch_call in files.items():
    with open(file, "r") as f:
        content = f.read()
    
    # Just replace the whole useEffect block
    new_content = re.sub(r'useEffect\(\(\) => \{.*?\}, \[\]\);', '', content, flags=re.DOTALL)
    
    if "grow" in file:
        effect = """  useEffect(() => {
    fetch("http://localhost:8001/api/grow/recommend")
      .then(res => res.json())
      .then(data => {
        if (data.recommendation) {
          setPlan([{
            goal: "Improve completion of two-step instructions",
            activity: data.recommendation.activity_id + " Recommended",
            difficulty: data.recommendation.recommended_difficulty,
            reason: data.reason
          }]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);"""
    elif "track" in file:
        effect = """  useEffect(() => {
    fetch("http://localhost:8001/api/track/trends")
      .then(res => res.json())
      .then(resData => {
        if (resData.history) {
          setData(resData.history.map((d: any) => ({
            session: d.session_id,
            accuracy: Math.round(d.accuracy * 100),
            latency: d.response_time_sec
          })));
        }
        setTrendInfo(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);"""
    elif "reports" in file:
        effect = """  useEffect(() => {
    fetch("http://localhost:8001/api/reports")
      .then(res => res.json())
      .then(json => {
        if (json.reports && json.reports.length > 0) {
          setReports(json.reports);
          setSelectedReportId(json.reports[0].id);
        }
      })
      .catch(err => console.error("Failed to fetch reports:", err));
  }, []);"""
  
    # Find insertion point (after const [...])
    insert_pos = new_content.find("if (!hasActivePatient)")
    if insert_pos == -1:
        insert_pos = new_content.find("return (")
    
    final_content = new_content[:insert_pos] + effect + "\n\n" + new_content[insert_pos:]
    
    with open(file, "w") as f:
        f.write(final_content)
