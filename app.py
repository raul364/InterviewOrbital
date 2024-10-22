from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os 
from dotenv import load_dotenv
import re
from collections import Counter

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/usage/*": {"origins": "http://localhost:3000"}}) # allows making requests to port 3000.

MESSAGES_API = os.getenv("MESSAGES_API")
REPORTS_API = os.getenv("REPORTS_API")

def check_palindrome(text, credits):
    # Initialize two pointers
    left, right = 0, len(text) - 1

    while left < right:
        # Move left pointer to the next alphanumeric character
        while left < right and not text[left].isalnum():
            left += 1
        # Move right pointer to the previous alphanumeric character
        while left < right and not text[right].isalnum():
            right -= 1
        
        # Compare the characters
        if text[left].lower() != text[right].lower():
            return round(credits, 3), None
        
        left += 1
        right -= 1

    credits *= 2  # Double the cost for palindrome
    return round(credits, 3), None

def calculate_credits(message):
    text = message['text']
    report_id = message.get('report_id')

    credits = 1.0 # base cost

    #if report id exists get credit cost for the id.
    if report_id:
        response = requests.get(REPORTS_API.replace(":id", str(report_id)))
        if response.status_code == 200:
            report_data = response.json()
            credits = float(report_data.get('credit_cost', 0))
            name = report_data.get('name', None)
            return round(credits, 3), name
        
        # Fallback if report not found
        return round(credits, 3), None
    
    credits += 0.05 * len(text)

    # filter words based on the rules
    words = re.findall(r"\b[\w'-]+\b", text)

    # create a dictionary of words and how many times they show up in the text
    word_counts = Counter(words)
    unique_words = len(word_counts)

    for word in words:
        word_len = len(word)
        if word_len <= 3 :
            credits += 0.1
        elif word_len <= 7:
            credits += 0.2
        else:
            credits += 0.3
        
        #check every third character in the word
        for i in range(2, len(word), 3):
            if word[i].lower() in 'aeiou':
                credits += 0.3
            
    if len(text) > 100:
        credits += 0.5
    
    if unique_words == len(words):
        credits = max(1, credits -2)
    
    # Check for palindrome
    return check_palindrome(text, credits)



@app.route("/usage", methods=['GET'])
def usage():
    response = requests.get(MESSAGES_API)
    if response.status_code != 200:
        return jsonify({"error": "failed to retrieve messages"})
    
    messages = response.json().get('messages',[])
    data = []
    for message in messages:
        credits_used, report_name = calculate_credits(message)

        usage_entry = {
            "message_id": message['id'],
            "timestamp": message['timestamp'],
            "credits_used": credits_used
        }

        if report_name:
            usage_entry['reportname'] = report_name
        
        data.append(usage_entry)

    return jsonify({"usage": data})


if __name__ == '__main__':
    app.run(debug=True)