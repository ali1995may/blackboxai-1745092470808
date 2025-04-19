const axios = require('axios');

exports.getAds = async (req, res, next) => {
  try {
    const { search_terms, ad_type, ad_reached_countries } = req.query;
    const accessToken = process.env.FACEBOOK_API_ACCESS_TOKEN;
    const apiVersion = process.env.FACEBOOK_API_VERSION || 'v17.0';

    if (!accessToken) {
      return res.status(500).json({ message: 'Facebook API access token not configured' });
    }

    const params = {
      access_token: accessToken,
      search_terms,
      ad_type,
      ad_reached_countries,
    };

    const url = `https://graph.facebook.com/${apiVersion}/ads_archive`;

    const response = await axios.get(url, { params });

    res.json(response.data);
  } catch (err) {
    next(err);
  }
};
