class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :user_name
      t.string :email
      t.string :password_digest
      t.string :remember_digest
      t.string :profile
      t.string :phone

      t.timestamps
    end
    add_index :users, :user_name, unique: true
  end
end
