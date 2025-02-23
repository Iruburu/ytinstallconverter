# yt-dlp
# ffmpeg

import csv
import subprocess

standardMode = input('Modo padrão: ')

def prepareCommand(info): 
    url, title, method = info[0], info[1], info[2]
     
    downloadsFolder = f"~/Documentos/GitHub/ytvinstallConverter/downloads/{
        title if title else '%(title)s'
    }.%(ext)s"

    return [
        'yt-dlp',
        '-x',
        '--audio-format',
        method if method else standardMode , 
        '-o',
        downloadsFolder,
        url
    ]

with open('URLs.csv', mode='r', encoding='utf-8') as arquivo:
    leitor_csv = csv.reader(arquivo)
    for linha in leitor_csv:
        subprocess.run(prepareCommand(linha))