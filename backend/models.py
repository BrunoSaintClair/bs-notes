import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, Table, Uuid, Boolean, DateTime
from sqlalchemy.orm import relationship
from database import Base

post_tags = Table(
    'post_tags',
    Base.metadata,
    Column('post_id', Uuid, ForeignKey('posts.id'), primary_key=True),
    Column('tag_id', Uuid, ForeignKey('tags.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    google_id = Column(String, unique=True, nullable=False)
    
    posts = relationship('Post', back_populates='user')

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    
    posts = relationship('Post', secondary=post_tags, back_populates='tags')

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    content = Column(String, nullable=False, default="")
    image = Column(String, nullable=True, default="")
    date = Column(String, nullable=False)

    is_public = Column(Boolean, default=True)
    user_id = Column(Uuid, ForeignKey('users.id'), nullable=False)
    
    user = relationship('User', back_populates='posts')
    tags = relationship('Tag', secondary=post_tags, back_populates='posts')
    reactions = relationship('Reaction', back_populates='post', cascade='all, delete-orphan')
    comments = relationship('Comment', back_populates='post', cascade='all, delete-orphan')
    unique_views = relationship('PostView', back_populates='post', cascade='all, delete-orphan')

    @property
    def views(self):
        return len(self.unique_views)

class PostView(Base):
    __tablename__ = 'post_views'
    
    post_id = Column(Uuid, ForeignKey('posts.id'), primary_key=True)
    user_id = Column(Uuid, ForeignKey('users.id'), primary_key=True)
    viewed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    post = relationship('Post', back_populates='unique_views')

class Reaction(Base):
    __tablename__ = 'reactions'
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    post_id = Column(Uuid, ForeignKey('posts.id'), nullable=False)
    type = Column(String, nullable=False)
    user_id = Column(Uuid, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    post = relationship('Post', back_populates='reactions')
    user = relationship('User')

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    post_id = Column(Uuid, ForeignKey('posts.id'), nullable=False)
    user_id = Column(Uuid, ForeignKey('users.id'), nullable=False)
    content = Column(String(300), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    post = relationship('Post', back_populates='comments')
    user = relationship('User')

    @property
    def username(self):
        return self.user.username if self.user else "Anônimo"

class DictionaryItem(Base):
    __tablename__ = 'dictionary_items'
    
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    term = Column(String, nullable=False, unique=True)
    definition = Column(String, nullable=False)
    letter = Column(String, nullable=False)
