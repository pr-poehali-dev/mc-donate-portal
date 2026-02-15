import json
import os
import urllib.request


def handler(event, context):
    """Вебхук Telegram-бота MatrichaPVP для приёма команд и заявок на донаты"""
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
    raw_body = event.get('body', '{}') or '{}'
    if isinstance(raw_body, dict):
        update = raw_body
    else:
        update = json.loads(raw_body)
        if isinstance(update, str):
            update = json.loads(update)
    message = update.get('message', {})
    text = message.get('text', '')
    chat_id = message.get('chat', {}).get('id')

    if not chat_id:
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'ok': True})
        }

    if text and text.startswith('/start '):
        payload = text.replace('/start ', '').strip()
        response_text = (
            f"⚔️ *MatrichaPVP — Заявка на донат*\n\n"
            f"📝 Данные: `{payload}`\n\n"
            "💳 Переводы идут на эту карту:\n"
            "`2202206241883953`\n\n"
            "⏱ Донат придёт в течении 10 минут после оплаты!\n\n"
            "После перевода отправьте сюда скриншот чека."
        )
    elif text == '/start':
        response_text = (
            "⚔️ *MatrichaPVP — Донат-бот*\n\n"
            "💳 Переводы идут на эту карту:\n"
            "`2202206241883953`\n\n"
            "⏱ Донат придёт в течении 10 минут после оплаты!\n\n"
            "📋 *Донаты:*\n"
            "⭐ VIP — 20₽\n"
            "👑 GOD — 30₽\n"
            "🐉 DRAGON — 60₽\n"
            "🎥 YT — Бесплатно (100+ подписчиков)\n\n"
            "Для покупки напиши свой ник и название доната.\n"
            "Например: `Steve GOD`"
        )
    elif text == '/help':
        response_text = (
            "📖 *Команды:*\n"
            "/start — Информация о донатах\n"
            "/help — Список команд\n"
            "/donates — Список донатов\n\n"
            "Для покупки напиши: `НикИгрока НазваниеДоната`"
        )
    elif text == '/donates':
        response_text = (
            "👑 *Донаты MatrichaPVP:*\n\n"
            "⭐ *VIP* — 20₽\n"
            "• Префикс [VIP]\n"
            "• Цветной чат\n"
            "• 3 дома\n\n"
            "👑 *GOD* — 30₽\n"
            "• Префикс [GOD]\n"
            "• Полёт в лобби\n"
            "• 5 домов\n\n"
            "🐉 *DRAGON* — 60₽\n"
            "• Префикс [DRAGON]\n"
            "• Полёт везде\n"
            "• 10 домов\n\n"
            "🎥 *YT* — Бесплатно\n"
            "• Требуется 100+ подписчиков"
        )
    else:
        response_text = (
            f"✅ Заявка принята!\n\n"
            f"Ваше сообщение: `{text}`\n\n"
            "💳 Переведите сумму на карту:\n"
            "`2202206241883953`\n\n"
            "⏱ Донат будет выдан в течении 10 минут после оплаты.\n"
            "Если есть вопросы — пишите сюда!"
        )

    send_message(token, chat_id, response_text)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }


def send_message(token, chat_id, text):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)