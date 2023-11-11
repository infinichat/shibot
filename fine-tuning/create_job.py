import openai
import os

def open_file(filepath):
    with open(filepath, "r", encoding='utf-8') as infile:
        return infile.read()

def save_file(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as outfile:
        outfile.write(content)

api_key = os.getenv('api_key')

if api_key is None:
    raise ValueError("API key not set. Please set your OpenAI API key.")

openai.api_key = api_key

# Uncomment this section to retrieve the status of a fine-tuning job


# file_id = 'file-pH3deIouk6LplcrU5Vh2gs66'  # Replace with the actual file ID
# model_name = "gpt-3.5-turbo"  # Replace with the actual model name

# try:
#     response = openai.FineTuningJob.create(
#         training_file=file_id,
#         model=model_name
#     )
#     job_id = response['id']
#     print(f"Fine-tuning created successfully with ID: {job_id}")
# except Exception as e:
#     print(f"Error creating fine-tuning job: {str(e)}")


status = openai.FineTuningJob.retrieve('ftjob-FNtfuETBTVh5wTamnEB4Csr4')
print(status)

