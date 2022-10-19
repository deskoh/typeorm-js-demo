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

  @ManyToMany(() => Tag, tag => tag.posts)
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
