from flask import Flask, render_template, request, jsonify
import pandas as pd
import random
import pickle
import nltk
nltk.download('omw-1.4')
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import datetime
import numpy as np
from scipy import spatial

# Initialize Flask app
app = Flask(__name__)

# Initialize lemmatizer and load data
lemma = WordNetLemmatizer()

with open("data.pkl", "rb") as f:
    data = pickle.load(f)
    embedding_dict = data["word_vectors"]
    common_words = data["common_words"]

def find_close(embedding):
    return sorted(embedding_dict.keys(), key=lambda word:spatial.distance.euclidean(embedding_dict[word],embedding))


# Helper functions
def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


def get_word_of_the_day():
    today = datetime.date.today()
    days_since_epoch = (today - datetime.date(1970, 1, 1)).days
    index = days_since_epoch % len(common_words)
    return common_words[index]
secret = get_word_of_the_day()
indexes=find_close(embedding_dict[secret])
guessed_words=[]
current_indx=10000
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        print(secret)
        word_input = request.form.get("word")
        
        if not word_input:
            return jsonify({"status": "error", "message": "No word provided!"})

        # Process the guess
        guess = lemma.lemmatize(word_input.strip().lower())

        if guess in stopwords.words('english'):
            return jsonify({"status": "message", "message": "Word too common!"})
        elif guess in guessed_words:
             return jsonify({"status":"message","message":"Already guessed!"})
        elif guess == secret:
            guessed_words.append(guess)
            current_indx=1
            return jsonify({"status": "success", "message": "Correct guess!", "word": guess, "index": 1.0})
        elif guess not in indexes:
            guessed_words.append(guess)
            similarity = cosine_similarity(embedding_dict[guess], embedding_dict[secret])
            return jsonify({"status": "success","word": guess, "index":float(similarity)})
        else:
            guessed_words.append(guess)
            #current_indx=min(current_indx,indexes.index(guess)+1)
            return jsonify({"status": "success", "word": guess, "index": indexes.index(guess)+1})

    return render_template("index.html",data=indexes)


if __name__ == '__main__':
    app.run()
