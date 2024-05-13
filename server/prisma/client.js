const { PrismaClient } = require('@prisma/client')

module.exports = new PrismaClient().$extends({
    query: {
        tempSensor: {
            async create({ model, operation, args, query }) {
                // take incoming `where` and set `age`
                console.log("create", model, operation, args, query)
        
                return query(args)
              },

        // $allOperations({ model, operation, args, query }) {
        //   /* your custom logic here */
        //   console.log("all operations", model, operation, args, query)
        //   return query(args)
        
      },
    },
  })