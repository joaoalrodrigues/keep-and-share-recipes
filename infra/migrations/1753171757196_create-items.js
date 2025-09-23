exports.up = (pgm) => {
  pgm.createTable("items", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "varchar(60)",
      notNull: true,
      unique: true,
    },
    type: {
      type: "varchar(30)",
      notNull: true,
    },
    base_unit: {
      type: "varchar(20)",
      notNull: true,
    },
  });

  pgm.createTable("item_units", {
    item_id: {
      type: "uuid",
      notNull: true,
      references: '"items"',
      onDelete: "cascade",
    },
    unit: {
      type: "varchar(20)",
      notNull: true,
    },
    conversion_factor_to_base_unit: {
      type: "numeric(10, 4)",
      notNull: true,
    },
  });
};

exports.down = false;
