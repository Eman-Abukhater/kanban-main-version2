import { pool } from '../config/database.js';

/** GET /api/ProjKanbanBoards/authuser
 *  (simple stub for now; we’ll add JWT later)
 */
export async function authUser(req, res) {
  try {
    // return the seeded admin for now
    const { rows } = await pool.query(
      `SELECT user_id AS userid, username, email, role, fk_po_id AS fkpoid, user_pic AS userpic
       FROM users
       WHERE email = 'admin@esap.com'
       LIMIT 1`
    );
    if (!rows[0]) return res.status(404).json({ message: 'No user' });
    return res.json({ user: rows[0] });
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  }
}

/** GET /api/ProjKanbanBoards/getBoardlist?fkpoid=101 */
export async function getBoardlist(req, res) {
  try {
    const fkpoid = Number(req.query.fkpoid ?? 101); // default for now
    const { rows } = await pool.query(
      `SELECT board_id AS "boardId",
              title,
              status,
              created_by AS "createdBy",
              fk_po_id AS "fkpoid"
       FROM boards
       WHERE fk_po_id = $1
       ORDER BY board_id ASC`,
      [fkpoid]
    );
    return res.json(rows);
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  }
}

/** POST /api/ProjKanbanBoards/addboard
 *   { "title":"Bug Tracking Board", "fkpoid":101, "createdBy":1 }
 */
export async function addBoard(req, res) {
  try {
    const { title, fkpoid, createdBy } = req.body;
    if (!title || !fkpoid) return res.status(400).json({ message: 'title and fkpoid are required' });

    const { rows } = await pool.query(
      `INSERT INTO boards(title, fk_po_id, created_by, status)
       VALUES ($1,$2,$3,'active')
       RETURNING board_id AS "boardId", title, status, created_by AS "createdBy", fk_po_id AS "fkpoid"`,
      [title, fkpoid, createdBy ?? null]
    );
    return res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  }
}

/** PUT /api/ProjKanbanBoards/editboard
 *   { "boardId":1, "title":"New Name" }
 */
export async function editBoard(req, res) {
  try {
    const { boardId, title } = req.body;
    if (!boardId || !title) return res.status(400).json({ message: 'boardId and title are required' });

    await pool.query(`UPDATE boards SET title=$1, updated_at=NOW() WHERE board_id=$2`, [title, boardId]);
    return res.json({ message: 'Board updated' });
  } catch (e) {
    console.error(e); res.status(500).json({ error: e.message });
  }
}
