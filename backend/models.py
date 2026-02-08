import uuid
from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

post_tags = Table(
    'post_tags',
    Base.metadata,
    Column('post_id', UUID(as_uuid=True), ForeignKey('posts.id'), primary_key=True),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id'), primary_key=True)
)


class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    
    posts = relationship('Post', back_populates='user')


class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    
    posts = relationship('Post', secondary=post_tags, back_populates='tags')


class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    image = Column(String, nullable=False)
    date = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    
    user = relationship('User', back_populates='posts')
    tags = relationship('Tag', secondary=post_tags, back_populates='posts')


class DictionaryItem(Base):
    __tablename__ = 'dictionary_items'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    term = Column(String, nullable=False, unique=True)
    definition = Column(String, nullable=False)
    letter = Column(String, nullable=False)
