import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeUpdate
} from "typeorm";

import { Base } from "./Base";
import { Tag } from "./Tag";

@Entity()
export class Post extends Base {
  @PrimaryGeneratedColumn()
  id = undefined;

  @Column("varchar")
  title = "";

  @Column("varchar")
  text = "";

  @BeforeUpdate()
  updateTags() {
    // Tag to be updated manually using join table
    this.tags = undefined;
  }

  // @OneToMany(() => PostToTag, PostToTag => PostToTag.post, {
  //   cascade: true,
  // })
  // postToTags;

  @ManyToMany(() => Tag, tag => tag.posts, {
    cascade: ["insert"],
  })
  @JoinTable({
    name: 'PostTag',
    /* joinColumn: {
      name: 'postId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    }, */
  })
  tags;
}
