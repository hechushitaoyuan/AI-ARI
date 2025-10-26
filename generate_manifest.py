import os
import json

def generate_manifest():
    """
    Scans the asset directories (01Real, 02AI, 03Intro) and generates
    a manifest.json file that lists all complete question sets.
    """
    real_path = '01Real'
    ai_path = '02AI'
    intro_path = '03Intro'

    # Use a dictionary to group files by their base name (e.g., '1', '01', '2')
    # This allows us to match '1.png' with '1.txt' etc.
    file_groups = {}

    # Helper function to process a directory
    def process_directory(dir_path, file_type):
        if not os.path.isdir(dir_path):
            print(f"Warning: Directory '{dir_path}' not found.")
            return
        for filename in os.listdir(dir_path):
            base_name = os.path.splitext(filename)[0]
            if base_name not in file_groups:
                file_groups[base_name] = {}
            # Store the full path, replacing backslashes for web compatibility
            file_groups[base_name][file_type] = os.path.join(dir_path, filename).replace('\\', '/')

    # Process all three asset directories
    process_directory(real_path, 'real')
    process_directory(ai_path, 'ai')
    process_directory(intro_path, 'intro')

    # Build the final manifest list, only including entries that are complete
    # (i.e., have a real image, an AI image, and an intro text)
    manifest = []
    sorted_keys = sorted(file_groups.keys()) # Sort for consistent output
    for base_name in sorted_keys:
        paths = file_groups[base_name]
        if 'real' in paths and 'ai' in paths and 'intro' in paths:
            try:
                with open(paths['intro'], 'r', encoding='utf-8') as f:
                    intro_content = f.read()
                manifest.append({
                    'real': paths['real'],
                    'ai': paths['ai'],
                    'intro': intro_content
                })
            except IOError as e:
                print(f"Warning: Could not read intro file {paths['intro']}: {e}")

    # Write the structured data to the manifest.json file
    try:
        with open('manifest.json', 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
        print(f"Successfully generated manifest.json with {len(manifest)} entries.")
    except IOError as e:
        print(f"Error writing to manifest.json: {e}")

if __name__ == '__main__':
    generate_manifest()
