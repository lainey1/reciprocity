"""create collections recipes table

Revision ID: d0e3f76ce177
Revises: ce1039f3e457
Create Date: 2025-01-14 12:06:45.860277

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'd0e3f76ce177'
down_revision = 'ce1039f3e457'
branch_labels = None
depends_on = None


def upgrade():
    schema = os.environ.get("SCHEMA") if environment == "production" else None

    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('collection_recipes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('collection_id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('added_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['collection_id'], ['collections.id'], ),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema=schema
    )
    with op.batch_alter_table('recipes', schema=None) as batch_op:
        batch_op.alter_column('prep_time',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('cook_time',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('recipes', schema=None) as batch_op:
        batch_op.alter_column('cook_time',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('prep_time',
               existing_type=sa.INTEGER(),
               nullable=False)

    op.drop_table('collection_recipes')
    # ### end Alembic commands ###