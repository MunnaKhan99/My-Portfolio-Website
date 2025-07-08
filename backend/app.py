from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({'message': 'Missing required fields'}), 400

        # Email configuration from environment variables
        SENDER_EMAIL = os.getenv('SENDER_EMAIL')
        SENDER_PASSWORD = os.getenv('SENDER_PASSWORD')
        RECEIVER_EMAIL = os.getenv('RECEIVER_EMAIL') # Corrected to use RECEIVER_EMAIL env var

        if not all([SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL]):
            return jsonify({'message': 'Server email configuration missing'}), 500

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = f"New Contact Form Submission from {name}"

        body = f"""
Name: {name}
Email: {email}
Message: {message}
"""
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
            smtp.send_message(msg)
        return jsonify({'message': 'successfully send email!'}), 200

    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'message': 'Failed to send email.', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)