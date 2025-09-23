exports.up = (pgm) => {
  pgm.createTable("recipes", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    product_id: {
      type: "uuid",
      notNull: true,
      references: '"items"',
      onDelete: "cascade",
    },
    yield_quantity: {
      type: "numeric(10, 2)",
      notNull: true,
    },
    preparation_method: {
      type: "text",
    },
  });
  pgm.createTable("recipe_lines", {
    recipe_id: {
      type: "uuid",
      notNull: true,
      references: '"recipes"',
      onDelete: "cascade",
    },
    input_id: {
      type: "uuid",
      notNull: true,
      references: '"items"',
      onDelete: "cascade",
    },
    quantity_in_base_unit: {
      type: "numeric(10, 2)",
      notNull: true,
    },
  });
};

exports.down = false;
