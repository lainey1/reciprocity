"""remove recipe difficulty, number of likes and image urls

Revision ID: ce1039f3e457
Revises: 74bf3e1309b8
Create Date: 2025-01-11 11:53:08.160850

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ce1039f3e457'
down_revision = '74bf3e1309b8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('recipes', schema=None) as batch_op:
        batch_op.drop_column('difficulty')
        batch_op.drop_column('image_url')
        batch_op.drop_column('number_likes')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('recipes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('number_likes', sa.INTEGER(), server_default=sa.text("'0'"), nullable=False))
        batch_op.add_column(sa.Column('image_url', sa.VARCHAR(length=255), nullable=True))
        batch_op.add_column(sa.Column('difficulty', sa.VARCHAR(length=20), nullable=False))

    # ### end Alembic commands ###
