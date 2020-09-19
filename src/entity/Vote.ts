import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity()
export class Vote {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn("int") userId: number;
  @PrimaryColumn("int") postId: number;

  @ManyToMany(() => User)
  @JoinTable()
  user: User[];

  @ManyToMany(() => Post)
  @JoinTable()
  post: Post[];
}
