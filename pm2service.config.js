module.exports = {
  apps : [{
    name        : "sService",
    script      : "./bin/www",
    watch       : false,
		log_file: "../logs/combined.outerr.log",
		out_file: "../logs/out.log",
		error_file: "../logs/err.log",
		node_args:"--max-old-space-size=512",
    env: {
      "NODE_ENV": "development",
      "PORT":"3000",
      "DTYPE":"service"
    },
    env_production : {
      "NODE_ENV": "production",
      "PORT":"80",
      "DTYPE":"service"
    },
    log_date_format : "YYYY-MM-DD HH:mm:ss"
  }]
}
