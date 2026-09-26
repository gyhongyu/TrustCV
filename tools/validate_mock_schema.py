import json
import os
import sys
from jsonschema import validate, ValidationError

def validate_schemas():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. Validate jobs_seed.json
    jd_schema_path = os.path.join(base_dir, "specs", "03_data_schemas", "jd_provisioning.schema.json")
    jobs_seed_path = os.path.join(base_dir, "specs", "mock_data", "jobs_seed.json")
    
    with open(jd_schema_path, "r", encoding="utf-8") as f:
        jd_schema = json.load(f)
    with open(jobs_seed_path, "r", encoding="utf-8") as f:
        jobs_seed = json.load(f)
        
    print(f"🔍 正在校驗 jobs_seed.json ({len(jobs_seed)} 筆資料)...")
    for i, job in enumerate(jobs_seed):
        try:
            validate(instance=job, schema=jd_schema)
            print(f"  ✅ 職缺 [{i+1}] {job.get('jd_reference_id')} 通過 Schema 驗證！")
        except ValidationError as e:
            print(f"  ❌ 職缺 [{i+1}] 驗證失敗: {e.message}")
            sys.exit(1)
            
    # 2. Validate candidates_seed.json
    cand_schema_path = os.path.join(base_dir, "specs", "03_data_schemas", "verified_candidate.schema.json")
    candidates_seed_path = os.path.join(base_dir, "specs", "mock_data", "candidates_seed.json")
    
    with open(cand_schema_path, "r", encoding="utf-8") as f:
        cand_schema = json.load(f)
    with open(candidates_seed_path, "r", encoding="utf-8") as f:
        candidates_seed = json.load(f)
        
    print(f"🔍 正在校驗 candidates_seed.json ({len(candidates_seed)} 筆資料)...")
    for i, cand in enumerate(candidates_seed):
        try:
            validate(instance=cand, schema=cand_schema)
            print(f"  ✅ 候選人 [{i+1}] {cand.get('dossier_id')} 通過 Schema 驗證！")
        except ValidationError as e:
            print(f"  ❌ 候選人 [{i+1}] 驗證失敗: {e.message}")
            sys.exit(1)
            
    print("\n🎉 恭喜！所有種子資料 100% 通過 JSON Schema 真理校準！")

if __name__ == "__main__":
    validate_schemas()
