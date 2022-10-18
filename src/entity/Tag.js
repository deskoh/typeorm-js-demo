import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"

import { Base } from "./Base";
import { Post } from "./Post";
// import { PostToTag } from "./PostToTag";

@Entity()
export class Tag extends Base {
  @PrimaryGeneratedColumn()
  id;

  @Column("varchar")
  name = "";

  // @OneToMany(() => PostToTag, postToTag => postToTag.tag)
  // postToTags;

  @ManyToMany(() => Post, post => post.tags)
  posts;
}