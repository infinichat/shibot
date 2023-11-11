import openai
import os

# Define function to open a file and return its contents as a string
def open_file(filepath):
    with open(filepath, 'r', encoding='utf8') as infile:
        return infile.read()

# Define a function to save content to a file
def save_file(filepath, content):
    with open(filepath, 'a', encoding='utf8') as outfile:
        outfile.write(content)

# Set the OpenAI API key directly or read it from an environment variable
api_key = os.getenv('api_key')  # Replace with your actual API key

openai.api_key = api_key

# Ensure that the file path uses double backslashes
file_path = "C:\\Users\\KONSTANTIN\\Desktop\\dev_code\\widget\\fine-tuning\\processed_data.jsonl"

with open(file_path, "rb") as file:
    response = openai.File.create(
        file=file,
        purpose='fine-tune'
    )
file_id = response['id']
print(f"File uploaded successfully with ID: {file_id}")
