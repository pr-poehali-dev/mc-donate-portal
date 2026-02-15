import json
import os
import urllib.request


def handler(event, context):
    """Устанавливает вебхук для Telegram-бота MatrichaPVP"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    token = os.environ.get('TELEGRAM_BOT_TOKEN', '')
    params = event.get('queryStringParameters') or {}
    webhook_url = params.get('webhook_url', '')

    if not webhook_url:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'webhook_url parameter required'})
        }

    url = f"https://api.telegram.org/bot{token}/setWebhook?url={webhook_url}"
    req = urllib.request.Request(url)
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read().decode('utf-8'))

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(result)
    }
