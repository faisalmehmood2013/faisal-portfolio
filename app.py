from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()
SENDER_EMAIL = os.getenv('SENDER_EMAIL')
APP_PASSWORD = os.getenv('APP_PASSWORD')
RECEIVER_EMAIL = os.getenv('RECEIVER_EMAIL')

app = Flask(__name__)
app.secret_key = os.getenv('app.secret_key') 

# --- Email Configuration ---
# Google Account -> Security -> 2-Step Verification ->
# SENDER_EMAIL = SENDER_EMAIL 
# APP_PASSWORD = APP_PASSWORD 
# RECEIVER_EMAIL = RECEIVER_EMAIL 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    msg = MIMEText(f"From: {name} ({email})\n\n{message}")
    msg['Subject'] = f"New Portfolio Message from {name}"
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SENDER_EMAIL, APP_PASSWORD)
            server.send_message(msg)
       
        return jsonify({"status": "success", "message": "Thank you! Your message has been sent."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    app.run(debug=True)