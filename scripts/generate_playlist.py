from pathlib import Path
import json
music=Path('music')
exts={'.mp3','.m4a','.ogg','.wav'}
files=sorted([p.name for p in music.iterdir() if p.is_file() and p.suffix.lower() in exts and p.stat().st_size>=1024])
(music/'playlist.json').write_text(json.dumps(files,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'playlist.json: {len(files)} tracks')
