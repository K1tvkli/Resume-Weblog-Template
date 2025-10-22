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
            
            # Scale to 0.5x to make it smaller
            scale_multiplier = 0.5
            scaled_size = int(target_size * scale_multiplier)
            img_scaled = img_cropped.resize((scaled_size, scaled_size), Image.Resampling.LANCZOS)
            
            # Create final image with target size
            final_img = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
            
            # Center the scaled image
            offset = ((target_size - scaled_size) // 2, (target_size - scaled_size) // 2)
            final_img.paste(img_scaled, offset, img_scaled)
            
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
