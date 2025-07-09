import phonenumbers
from phonenumbers import geocoder, PhoneNumberFormat

def format_phone(phone, code="LK"):	
	try:
		parsed = phonenumbers.parse(phone, code)
		formatted = phonenumbers.format_number(parsed, PhoneNumberFormat.INTERNATIONAL)
		return formatted
	except phonenumbers.phonenumberutil.NumberParseException:
		return None