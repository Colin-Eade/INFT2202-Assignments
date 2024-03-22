import express from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next): void {
  res.send('respond with a resource');
});

export default router;
