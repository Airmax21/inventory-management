import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany, Relation, ManyToOne, JoinColumn } from "typeorm";
import { Item } from "./item.entity";
import { Category } from "./category.entity";
import { Transaction } from "./transaction.entity";

@Entity('masters')
@Index('UQ_master_name', ['name'], {
    unique: true,
    where: '(deleted_at IS NULL)'
})
export class Master extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'citext' })
    name?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @Column({ name: 'category_id' })
    categoryId!: string;

    @ManyToOne('Category', 'masters')
    @JoinColumn({
        name: 'category_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_masters_category'
    })
    category?: Relation<Category>;

    @DeleteDateColumn({
        nullable: true,
        name: 'deleted_at',
        type: 'timestamp with time zone',
        default: null,
    })
    deletedAt!: Date | null;

    @OneToMany('Item', 'masters')
    items?: Relation<Item[]>
}