"""adding connection status field

Revision ID: 74bf3e1309b8
Revises: 1edd0f7cac91
Create Date: 2025-01-10 08:06:47.432944

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '74bf3e1309b8'
down_revision = '1edd0f7cac91'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('connections', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=20), nullable=False,  server_default='pending'))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('connections', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###
