module.exports = {
   tables: [
       {
         name: 'productCategory',
         fields: [
            { name: 'name', type: 'TEXT' },
            { name: 'description', type: 'TEXT' },
            { name: 'dependency', type: 'BITGINT(100)' },
            { name: 'manufacturer', type: 'TEXT' },
            { name: 'status', type: 'varchar(50)' },
            { name: 'createdAt', type: 'DATETIME' }
         ]
      },
      {
         name: 'products',
         fields: [
            { name: 'image', type: 'TEXT' },
            { name: 'name', type: 'TEXT' },
            { name: 'quantity', type: 'INTEGER' },
            { name: 'description', type: 'TEXT' },
            { name: 'productCategoryID', type: 'BITGINT(100)' },
            { name: 'dateMan', type: 'TEXT' },
            { name: 'dateExp', type: 'TEXT' },
            { name: 'purchasePrice', type: 'INTEGER' },
            { name: 'sellingPrice', type: 'INTEGER' },
            { name: 'status', type: 'varchar(50)' },
            { name: 'createdAt', type: 'DATETIME' }
         ]
      },
      {
         name: 'productStock',
         fields: [
            { name: 'productID', type: 'INTEGER' },
            { name: 'quantity', type: 'INTEGER' },
            { name: 'status', type: 'varchar(50)' },
            { name: 'createdAt', type: 'DATETIME' }
         ]
      },
      {
         name: 'customers',
         fields: [
            { name: 'name', type: 'TEXT' },
            { name: 'phone', type: 'TEXT' },
            { name: 'email', type: 'TEXT' },
            { name: 'status', type: 'varchar(50)' },
            { name: 'createdAt', type: 'DATETIME' }
         ]
      }
   ]
}
 