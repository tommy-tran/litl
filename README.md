# litl (Link Is Too Long)

## Description:

litl is a full stack utility application with the following features:

- Link simplification/shortener like goo.gl, bit.ly **+ ability to protect links with a password**
- Authentication via Oauth through github and google
- Password generation and saving (requires authentication)
- Simple status message fetching and updating, ideal for people who want have a simple and easily updatable status message on their personal website

- Drag and drop image upload (requires authentication, to be implemented)

### Link Shortener
Link codes contain alphanumeric characters[a-z, A-Z, 0-9] and is between 1 to 4 in length:
Therefore there are 43679 possible combinations currently and can be easily extended if necessary.

### Password Generation
Options for password generation include:
* length: 1-100 (any higher input will be changed to 100)
* symbols: Include symbols, default is false
* uppercase: Include uppercase, default is true,
* excludeSimilarCharacters: Exclude characters: i, I, l, L, o, O, and 0. Default is false
* exclude: Optionally exclude additional characters

### Status Management
Have a message available in a link given to your for fetching message in JSON format or sharing with a friend.