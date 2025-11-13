'''
Business: Send scheduled notifications via WhatsApp Business API
Args: event - dict with httpMethod, body containing {phone, message}
      context - object with request_id, function_name attributes
Returns: HTTP response dict with status
'''
import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str:
        body_str = '{}'
    body_data = json.loads(body_str)
    phone = body_data.get('phone')
    message = body_data.get('message')
    
    if not phone or not message:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'phone and message are required'}),
            'isBase64Encoded': False
        }
    
    api_token = os.environ.get('WHATSAPP_API_TOKEN')
    phone_number_id = os.environ.get('WHATSAPP_PHONE_ID', '')
    
    if not api_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'WHATSAPP_API_TOKEN not configured'}),
            'isBase64Encoded': False
        }
    
    phone_clean = phone.replace('+', '').replace('-', '').replace(' ', '').replace('(', '').replace(')', '')
    
    whatsapp_api_url = f'https://graph.facebook.com/v18.0/{phone_number_id}/messages'
    payload = json.dumps({
        'messaging_product': 'whatsapp',
        'to': phone_clean,
        'type': 'text',
        'text': {'body': message}
    }).encode('utf-8')
    
    req = urllib.request.Request(
        whatsapp_api_url,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_token}'
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message_id': result.get('messages', [{}])[0].get('id')
                }),
                'isBase64Encoded': False
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'WhatsApp API error',
                'details': error_body
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'error': 'Failed to send message',
                'details': str(e)
            }),
            'isBase64Encoded': False
        }