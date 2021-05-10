# Pemakaian Zoom Calendar

Track your zoom schedule across many accounts!

## Usage

1. Install Package using NPM
```bash
npm install
```

2. Make `.env` file and put your zoom apikey and apisecret there

```env
ZOOM_API_KEY=<YOUR_ZOOM_API_KEY>
ZOOM_API_SECRET=<YOUR_ZOOM_API_SECRET>
```

3. Modify the api endpoint call (at `/routes/index.js`) with your default account or put your zoom account in the api route path
```javascript
const resp = await axios.get(`https://api.zoom.us/v2/users/${req.query.account !== undefined ? req.query.account:'pusdatin@pnj.ac.id'}/meetings?page_size=300&type=upcoming`, { headers: {"Authorization" : `Bearer ${jwt}`} });
```

4. Run it
```
node /bin/www
```
