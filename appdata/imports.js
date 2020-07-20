const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongooseValidator = require('mongoose-unique-validator');

module.exports = {
  express,
  mongoose,
  bodyParser,
  helmet,
  colors,
  cookieParser,
  jwt,
  validator,
  bcrypt,
  mongooseValidator,
};
