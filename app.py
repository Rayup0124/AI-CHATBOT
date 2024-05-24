from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__, static_folder='.', static_url_path='')

openai.api_key = 'sk-proj-M1Vw46D0OTe8IropsVlxT3BlbkFJcp1FBQrAdimXlLN97SVX'

with open('material.txt', 'r', encoding='utf-8') as file:
    system_prompt = file.read().strip()

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', "")
    print("Received user input:", user_input)

    try:
        # Use the system_prompt from the file instead of a hardcoded message
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input},
            ]
        )
        response = completion.choices[0].message['content']
        return jsonify({'message': response})
    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({'message': "No response from OpenAI due to an error."})

if __name__ == "__main__":
    app.run(debug=True)
