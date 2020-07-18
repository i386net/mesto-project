const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const colors = require('colors');

module.exports = {
  express, mongoose, bodyParser, helmet, rateLimit, colors,
};
