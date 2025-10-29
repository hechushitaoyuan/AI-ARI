import os

def update_files():
    directory = '03Intro'
    suffix_to_add = '，同济设计'
    
    if not os.path.isdir(directory):
        print(f"Error: Directory '{directory}' not found.")
        return

    for filename in os.listdir(directory):
        if filename.endswith('.txt'):
            file_path = os.path.join(directory, filename)
            try:
                with open(file_path, 'r+', encoding='utf-8') as f:
                    content = f.read().strip()
                    if not content.endswith(suffix_to_add):
                        # Move pointer to the end of the original content
                        f.seek(len(content.encode('utf-8')))
                        f.write(suffix_to_add)
                        print(f"Updated: {filename}")
                    else:
                        print(f"Skipped (already updated): {filename}")
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

if __name__ == '__main__':
    update_files()
    print("\nBatch update complete.")
