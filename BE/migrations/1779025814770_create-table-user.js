export const up = (pgm) => {
  // Ganti 'nama_tabel_kamu' dengan nama tabel yang diinginkan, misal 'products' atau 'items'
  pgm.createTable('users', {
    id: 'id',
    name: { 
      type: 'varchar(100)', 
      notNull: false
    },
    descriptor: { 
      type: 'jsonb', 
      notNull: false 
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};