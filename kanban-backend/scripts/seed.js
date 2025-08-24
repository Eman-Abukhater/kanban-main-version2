import 'dotenv/config';
import { pool } from '../src/config/database.js';
import bcrypt from 'bcryptjs';

async function run() {
  await pool.query('TRUNCATE kanban_tags, kanban_tasks, kanban_cards, kanban_lists, boards, users RESTART IDENTITY CASCADE');

  const passwordHash = await bcrypt.hash('Passw0rd!', 10);

  const { rows: u } = await pool.query(
    `INSERT INTO users(username,email,password_hash,role,fk_po_id,user_pic)
     VALUES ('admin_user','admin@esap.com',$1,'admin',101,'admin-avatar.jpg')
     RETURNING user_id`,
    [passwordHash]
  );
  const adminId = u[0].user_id;

  const { rows: b } = await pool.query(
    `INSERT INTO boards(title,fk_po_id,created_by,status)
     VALUES ('Sprint Planning Board',101,$1,'active')
     RETURNING board_id`,
     [adminId]
  );
  const boardId = b[0].board_id;

  const { rows: lists } = await pool.query(
    `INSERT INTO kanban_lists(title,fk_board_id,seq_no,added_by)
     VALUES ('To Do',$1,1,'admin_user'),('In Progress',$1,2,'admin_user'),
            ('Testing',$1,3,'admin_user'),('Done',$1,4,'admin_user')
     RETURNING kanban_list_id, seq_no`,
     [boardId]
  );
  const todo = lists.find(l=>l.seq_no===1).kanban_list_id;
  const progress = lists.find(l=>l.seq_no===2).kanban_list_id;

  await pool.query(
    `INSERT INTO kanban_cards(title,"desc",fk_kanban_list_id,seq_no,completed,image_url,start_date,end_date,added_by)
     VALUES
     ('Setup Project Structure','Initialize folders', $1,1,false,'project-setup.jpg', NOW(), NOW() + interval '2 days','admin_user'),
     ('Database Schema Design','Create schema', $2,1,false,'database-design.jpg', NOW(), NOW() + interval '2 days','admin_user'),
     ('API Development','Build REST APIs', $2,2,false,NULL, NOW(), NOW() + interval '3 days','admin_user')`,
     [todo, progress]
  );

  console.log('✅ Seed OK');
  process.exit(0);
}

run().catch(e => (console.error(e), process.exit(1)));
