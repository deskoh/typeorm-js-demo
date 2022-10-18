import { Entity, PrimaryColumn, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm"

import { Base } from "./Base";

@Entity('PostTag')
export class PostTag extends Base {
  @PrimaryColumn("int")
  postId;

  @PrimaryColumn("int")
  tagId;

  // Optional
  // @ManyToOne(() => Post, (post) => post.tags)
  // post;

  // Optional
  // @ManyToOne(() => Tag, (tag) => tag.posts)
  // tag;
}