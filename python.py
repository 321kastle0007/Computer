import qrcode

def generate_qr_code(data, file_name="qr_code.png"):
    """
    Generates a QR code for the given data and saves it as an image file.
    
    Args:
        data (str): The data or URL to encode in the QR code.
        file_name (str): The name of the output image file. Defaults to 'qr_code.png'.
    """
    # Create a QR Code object
    qr = qrcode.QRCode(
        version=1,  # Controls the size of the QR Code
        error_correction=qrcode.constants.ERROR_CORRECT_L,  # Error correction level
        box_size=10,  # Size of each box in the QR code grid
        border=4,  # Thickness of the border (minimum is 4)
    )
    
    # Add data to the QR Code
    qr.add_data(data)
    qr.make(fit=True)
    
    # Create an image of the QR Code
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image to a file
    img.save(file_name)
    print(f"QR Code successfully generated and saved as '{file_name}'")

# Example usage
if __name__ == "__main__":
    # Replace this URL or text with the content you want to encode
    data_to_encode = "http://localhost:4000/asset/da:b6:6d:5b:96:e5"
    output_file_name = "example_qr_code.png"
    
    generate_qr_code(data_to_encode, output_file_name)
