import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany, Relation } from "typeorm";
import { Master } from "./master.entity";

@Entity('category')
@Index('UQ_category_name', ['name'], {
    unique: true,
    where: '(deleted_at IS NULL)'
})
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'citext' })
    name?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
        name: 'deleted_at',
        type: 'timestamp with time zone',
        default: null,
    })
    deletedAt!: Date | null;

    @OneToMany('Master','category')
    masters?: Relation<Master[]>
}