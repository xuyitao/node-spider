module.exports = {
  apps : [{
    name        : "sClient",
    script      : "./bin/www",
    watch       : true,
		log_file: "../logs/combined.outerr.log",
		out_file: "../logs/out.log",
		error_file: "../logs/err.log",
		node_args:"--max-old-space-size=512",
    env: {
      "NODE_ENV": "development",
      "PORT":"3000",
      "DTYPE":"client"
    },
    env_production : {
      "NODE_ENV": "production",
      "PORT":"80",
      "DTYPE":"client"
    },
    log_date_format : "YYYY-MM-DD HH:mm:ss"
  }]
}
