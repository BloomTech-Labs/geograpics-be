
exports.up = function(knex) {
  return knex.schema.createTable('users', t => {
    t.increments();
    t.biginteger('insta_id')
      .notNullable()
      .unique();
    t.string('access_token', 255)
      .notNullable()
      .unique();
    t.boolean('private')
      .defaultTo(false)
      .notNullable();
    t.string('username', 30)
      .notNullable()
      .unique();
    t.string('profile_pic');
    t.string('full_name')
      .notNullable();
    t.string('bio', 21000);
    t.string('website', 255);
    t.boolean('is_business')
      .defaultTo(false);
  })
  .createTable('pictures', t => {
    t.increments();
    t.biginteger('media_id')
      .notNullable()
      .unique();
    t.biginteger('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    t.decimal('longitude', null);
    t.decimal('latitude', null);
    t.string('thumbnail', 255)
      .notNullable();
    t.string('standard_resolution', 255)
      .notNullable();
    t.string('created_time', 255);
    t.string('caption', 21000);
    t.integer('likes')
      .defaultTo(0)
      .notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pictures')
    .dropTableIfExists('users');
};
