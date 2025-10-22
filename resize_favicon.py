#!/usr/bin/env python3
"""
Script to resize favicon images to fill the entire canvas
This makes the favicon appear larger in browser tabs
"""

from PIL import Image
import os

# Paths
favicon_dir = "/workspaces/Resume-Weblog-Template/public/images/Yousef"

# Files to resize
files_to_resize = [
    ("favicon-32x32.png", 32),
    ("android-chrome-512x512.png", 512),
]

print("🎨 Resizing favicons to make them larger...")

for filename, target_size in files_to_resize:
    filepath = os.path.join(favicon_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} not found, skipping...")
        continue
    
    try:
        # Open the image
        img = Image.open(filepath)
        print(f"\n📸 Processing {filename}")
        print(f"   Original size: {img.size}")
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Get the bounding box of the non-transparent content
        bbox = img.getbbox()
        
        if bbox:
            # Crop to content only
            img_cropped = img.crop(bbox)
            print(f"   Cropped to content: {img_cropped.size}")
            
            # Scale up the cropped content by 1.1x to make it slightly bigger
            scale_multiplier = 1.1
            scaled_size = int(target_size * scale_multiplier)
            img_scaled = img_cropped.resize((scaled_size, scaled_size), Image.Resampling.LANCZOS)
            
            # Create final image with target size
            new_img = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
            
            # Center crop the scaled image to fit target size
            left = (scaled_size - target_size) // 2
            top = (scaled_size - target_size) // 2
            right = left + target_size
            bottom = top + target_size
            
            final_img = img_scaled.crop((left, top, right, bottom))
            
        else:
            # If no bbox found, just resize
            final_img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # Save the result
        final_img.save(filepath, 'PNG', optimize=True)
        print(f"   ✅ Saved: {target_size}x{target_size} with enlarged content")
        
    except Exception as e:
        print(f"   ❌ Error processing {filename}: {e}")

print("\n✨ Done! Favicons have been resized to appear larger.")
print("🔄 Refresh your browser to see the changes.")
